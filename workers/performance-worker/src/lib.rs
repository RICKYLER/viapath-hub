use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use worker::*;

#[derive(Debug, Serialize, Deserialize)]
struct WorkerInput {
    id: String,
    name: String,
    category: String,
    rating: f64,
    lat: f64,
    lng: f64,
}

#[derive(Debug, Serialize, Deserialize)]
struct MatchRequest {
    client_lat: f64,
    client_lng: f64,
    category: Option<String>,
    workers: Vec<WorkerInput>,
}

#[derive(Debug, Serialize, Deserialize)]
struct MatchResult {
    id: String,
    name: String,
    category: String,
    rating: f64,
    distance_km: f64,
    score: f64,
}

const BASE32: &[u8] = b"0123456789bcdefghjkmnpqrstuvwxyz";

// Geohash encoding function
fn encode_geohash(lat: f64, lng: f64, precision: usize) -> String {
    let mut geohash = String::with_capacity(precision);
    let mut lat_interval = (-90.0, 90.0);
    let mut lng_interval = (-180.0, 180.0);
    let mut is_even = true;
    let mut bit = 0;
    let mut ch = 0;

    while geohash.len() < precision {
        if is_even {
            let mid = (lng_interval.0 + lng_interval.1) / 2.0;
            if lng > mid {
                ch |= 1 << (4 - bit);
                lng_interval.0 = mid;
            } else {
                lng_interval.1 = mid;
            }
        } else {
            let mid = (lat_interval.0 + lat_interval.1) / 2.0;
            if lat > mid {
                ch |= 1 << (4 - bit);
                lat_interval.0 = mid;
            } else {
                lat_interval.1 = mid;
            }
        }

        is_even = !is_even;
        if bit < 4 {
            bit += 1;
        } else {
            geohash.push(BASE32[ch as usize] as char);
            bit = 0;
            ch = 0;
        }
    }
    geohash
}

// Geohash decoding function (returns (lat, lng) representing the center of the bounding box)
fn decode_geohash(geohash: &str) -> Option<(f64, f64)> {
    let mut lat_interval = (-90.0, 90.0);
    let mut lng_interval = (-180.0, 180.0);
    let mut is_even = true;

    // Create lookup map
    let mut char_map = HashMap::new();
    for (i, &c) in BASE32.iter().enumerate() {
        char_map.insert(c as char, i);
    }

    for c in geohash.chars() {
        let index = match char_map.get(&c) {
            Some(&idx) => idx,
            None => return None,
        };

        for bit in 0..5 {
            let mask = 1 << (4 - bit);
            let bit_val = (index & mask) != 0;

            if is_even {
                let mid = (lng_interval.0 + lng_interval.1) / 2.0;
                if bit_val {
                    lng_interval.0 = mid;
                } else {
                    lng_interval.1 = mid;
                }
            } else {
                let mid = (lat_interval.0 + lat_interval.1) / 2.0;
                if bit_val {
                    lat_interval.0 = mid;
                } else {
                    lat_interval.1 = mid;
                }
            }
            is_even = !is_even;
        }
    }

    let lat = (lat_interval.0 + lat_interval.1) / 2.0;
    let lng = (lng_interval.0 + lng_interval.1) / 2.0;
    Some((lat, lng))
}

// Haversine Distance computation
fn haversine_distance(lat1: f64, lng1: f64, lat2: f64, lng2: f64) -> f64 {
    let earth_radius_km = 6371.0;
    let d_lat = (lat2 - lat1).to_radians();
    let d_lng = (lng2 - lng1).to_radians();

    let a = (d_lat / 2.0).sin().powi(2)
        + lat1.to_radians().cos() * lat2.to_radians().cos() * (d_lng / 2.0).sin().powi(2);
    let c = 2.0 * a.sqrt().atan2((1.0 - a).sqrt());

    earth_radius_km * c
}

#[event(fetch)]
pub async fn main(mut req: Request, env: Env, _ctx: worker::Context) -> Result<Response> {
    console_error_panic_hook::set_once();

    let url = req.url()?;
    let path = url.path();

    match (req.method(), path) {
        (Method::Get, "/health") => Response::ok("Rust performance worker is healthy!"),
        
        (Method::Get, "/distance") => {
            let query = url.query_pairs().collect::<HashMap<_, _>>();
            let lat1: f64 = query.get("lat1").and_then(|v| v.parse().ok()).unwrap_or(0.0);
            let lng1: f64 = query.get("lng1").and_then(|v| v.parse().ok()).unwrap_or(0.0);
            let lat2: f64 = query.get("lat2").and_then(|v| v.parse().ok()).unwrap_or(0.0);
            let lng2: f64 = query.get("lng2").and_then(|v| v.parse().ok()).unwrap_or(0.0);

            let distance = haversine_distance(lat1, lng1, lat2, lng2);
            
            let mut response_data = HashMap::new();
            response_data.insert("distance_km", distance);

            Response::from_json(&response_data)
        }

        (Method::Get, "/geohash/encode") => {
            let query = url.query_pairs().collect::<HashMap<_, _>>();
            let lat: f64 = query.get("lat").and_then(|v| v.parse().ok()).unwrap_or(0.0);
            let lng: f64 = query.get("lng").and_then(|v| v.parse().ok()).unwrap_or(0.0);
            let precision: usize = query.get("precision").and_then(|v| v.parse().ok()).unwrap_or(9);

            let hash = encode_geohash(lat, lng, precision);
            
            let mut response_data = HashMap::new();
            response_data.insert("geohash", hash);

            Response::from_json(&response_data)
        }

        (Method::Get, "/geohash/decode") => {
            let query = url.query_pairs().collect::<HashMap<_, _>>();
            let hash = match query.get("hash") {
                Some(h) => h,
                None => return Response::error("Missing 'hash' query param", 400),
            };

            match decode_geohash(hash) {
                Some((lat, lng)) => {
                    let mut response_data = HashMap::new();
                    response_data.insert("lat", lat);
                    response_data.insert("lng", lng);
                    Response::from_json(&response_data)
                }
                None => Response::error("Invalid geohash structure", 400),
            }
        }

        (Method::Post, "/match") => {
            let payload: MatchRequest = match req.json().await {
                Ok(p) => p,
                Err(_) => return Response::error("Invalid JSON body", 400),
            };

            let mut matched_workers: Vec<MatchResult> = Vec::new();

            for worker in payload.workers {
                if let Some(ref cat) = payload.category {
                    if !worker.category.to_lowercase().contains(&cat.to_lowercase()) {
                        continue;
                    }
                }

                let dist = haversine_distance(payload.client_lat, payload.client_lng, worker.lat, worker.lng);
                let proximity_score = if dist >= 25.0 {
                    0.0
                } else {
                    (25.0 - dist) / 25.0 * 5.0
                };
                
                let rating_score = worker.rating;
                let total_score = (proximity_score * 0.5) + (rating_score * 0.5);

                matched_workers.push(MatchResult {
                    id: worker.id,
                    name: worker.name,
                    category: worker.category,
                    rating: worker.rating,
                    distance_km: (dist * 100.0).round() / 100.0,
                    score: (total_score * 100.0).round() / 100.0,
                });
            }

            matched_workers.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap_or(std::cmp::Ordering::Equal));

            Response::from_json(&matched_workers)
        }

        _ => Response::error("Not Found", 404),
    }
}
