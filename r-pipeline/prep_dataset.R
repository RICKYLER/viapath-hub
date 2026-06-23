# ViaPathHub AI Chatbot Dataset Prep Pipeline
# Cleans, imputes, and formats database records for chatbot RAG injections.

library(jsonlite)
library(dplyr)

#' Clean and prepare workers data for Chatbot context
#' @param input_json_content character string of workers JSON data
#' @param output_csv_path filepath to write clean CSV
#' @param output_json_path filepath to write clean JSON
#' @return data.frame of cleaned and prepped worker profiles
prep_dataset <- function(input_json_content, output_csv_path = NULL, output_json_path = NULL) {
  # Parse JSON content
  workers_df <- fromJSON(input_json_content, simplifyDataFrame = TRUE)
  
  if (is.null(workers_df) || length(workers_df) == 0) {
    stop("Input worker dataset is empty or invalid.")
  }

  # Ensure columns exist, fill default values if absent
  required_cols <- c("id", "name", "service", "rating", "location", "about", "skills", "verified", "completedJobs", "barangay", "certifications")
  for (col in required_cols) {
    if (!col %in% colnames(workers_df)) {
      workers_df[[col]] <- NA
    }
  }

  # Clean and Impute
  # 1. Fill missing ratings with mean rating (ignoring zeros or NAs)
  valid_ratings <- workers_df$rating[!is.na(workers_df$rating) & workers_df$rating > 0]
  mean_rating <- if (length(valid_ratings) > 0) round(mean(valid_ratings), 2) else 4.80
  
  # 2. Impute columns
  cleaned_df <- workers_df %>%
    mutate(
      rating = ifelse(is.na(rating) | rating == 0, mean_rating, round(rating, 2)),
      completedJobs = ifelse(is.na(completedJobs), 0, completedJobs),
      verified = ifelse(is.na(verified), FALSE, verified),
      barangay = ifelse(is.na(barangay) | barangay == "", "Tagum City Center", barangay),
      about = ifelse(is.na(about) | about == "", "Service provider registered on ViaPathHub.", about)
    )

  # 3. Format context string specifically structured for LLM RAG ingestion
  cleaned_df <- cleaned_df %>%
    rowwise() %>%
    mutate(
      skills_str = paste(unlist(skills), collapse = ", "),
      certs_str = paste(unlist(certifications), collapse = ", "),
      # Compile semantic description
      chatbot_context = paste0(
        "Worker profile for ", name, " (ID: ", id, "). ",
        "Category: ", service, ". Located in ", location, " (Barangay: ", barangay, "). ",
        "They have completed ", completedJobs, " jobs with an average rating of ", rating, "/5.0. ",
        "Specialized Skills: ", ifelse(skills_str == "", "General", skills_str), ". ",
        "Certifications: ", ifelse(certs_str == "", "None listed", certs_str), ". ",
        "Bio: ", about, " (Verification Status: ", ifelse(verified, "Verified Pro", "Standard"), ")."
      )
    ) %>%
    ungroup()

  # Write output files if paths are provided
  if (!is.null(output_csv_path)) {
    write.csv(cleaned_df, output_csv_path, row.names = FALSE)
  }
  if (!is.null(output_json_path)) {
    write_json(cleaned_df, output_json_path, pretty = TRUE)
  }

  return(as.data.frame(cleaned_df))
}
