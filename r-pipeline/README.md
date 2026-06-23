# ViaPathHub R Chatbot Dataset Prep Pipeline

This directory contains a data cleaning and prep pipeline written in R. It processes raw worker data, imputes missing ratings, calculates key statistics, and outputs structured profile contexts suitable for feeding into an AI Chatbot (RAG context).

The service is exposed as a REST API using the **Plumber** library.

---

## Getting Started (with Docker)

To run this pipeline without installing R locally on your machine, you can run it inside a Docker container.

### 1. Build the Docker Image
Navigate to the `r-pipeline` directory and run:
```bash
docker build -t viapath-r-pipeline .
```

### 2. Run the Container
Start the container and map it to port `8000`:
```bash
docker run -p 8000:8000 --name viapath-r-server viapath-r-pipeline
```

The server will be available at: `http://localhost:8000`

---

## API Documentation & Endpoints

### 1. Healthcheck
* **Route**: `GET /health`
* **Purpose**: Verifies that the R pipeline server is operational.
* **Example**:
  ```bash
  curl http://localhost:8000/health
  ```

### 2. Dataset Preparation
* **Route**: `POST /prep`
* **Purpose**: Accepts raw workers JSON list, cleans it, calculates LLM chatbot contexts, and returns the formatted data.
* **Payload**:
  ```json
  [
    {
      "id": "w1",
      "name": "Lina Mae Torres",
      "service": "Massage Therapy",
      "rating": 4.90,
      "location": "Visayan Village, Tagum City",
      "about": "Certified home-service massage therapist.",
      "skills": ["Swedish massage", "Prenatal care"],
      "verified": true,
      "completedJobs": 124,
      "barangay": "Visayan Village",
      "certifications": ["NCII Massage Therapy"]
    }
  ]
  ```
* **Example**:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d @your_data.json http://localhost:8000/prep
  ```

### 3. Statistics Aggregation
* **Route**: `POST /stats`
* **Purpose**: Compares worker records to output summaries like average ratings and total active worker volumes for use in greeting context generators.
* **Example**:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d @your_data.json http://localhost:8000/stats
  ```
