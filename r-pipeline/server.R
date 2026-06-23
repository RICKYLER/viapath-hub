library(plumber)
source("prep_dataset.R")

function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PATCH, PUT")
  res$setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  }
  plumber::forward()
}

function() {
  list(
    status = "ok",
    service = "ViaPathHub R Pipeline",
    time = Sys.time()
  )
}
function(req) {
  post_data <- req$postBody

  if (is.null(post_data) || post_data == "") {
    fallback_data <- '[
      {"id":"w1","name":"Lina Mae Torres","service":"Massage Therapy","rating":4.9,"location":"Visayan Village","about":"Certified home-service massage therapist","skills":["Swedish massage"],"verified":true,"completedJobs":124,"barangay":"Visayan Village","certifications":["DOH Licensed"]},
      {"id":"w2","name":"Marco Silva","service":"Nail Technician","rating":0,"location":"Mankilam","about":"Nail art specialist","skills":["Nail Art"],"verified":true,"completedJobs":128,"barangay":"Mankilam","certifications":[]}
    ]'
    post_data <- fallback_data
  }

  tryCatch({
    prepped_df <- prep_dataset(post_data)
    list(
      success = TRUE,
      message = "Dataset prepared successfully for chatbot ingestion",
      record_count = nrow(prepped_df),
      dataset = prepped_df
    )
  }, error = function(e) {
    list(
      success = FALSE,
      error = e$message
    )
  })
}
function(req) {
  post_data <- req$postBody
  if (is.null(post_data) || post_data == "") {
    return(list(error = "No worker JSON data provided"))
  }
  
  tryCatch({
    df <- fromJSON(post_data, simplifyDataFrame = TRUE)
    list(
      total_workers = nrow(df),
      services_offered = unique(df$service),
      average_rating = round(mean(df$rating[df$rating > 0], na.rm = TRUE), 2),
      highly_rated_count = sum(df$rating >= 4.8, na.rm = TRUE)
    )
  }, error = function(e) {
    list(error = e$message)
  })
}
