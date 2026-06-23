# Use an official R runtime as a parent image
FROM rocker/r-ver:4.3.0

# Install system libraries required by plumber/jsonlite
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    libssl-dev \
    libcurl4-openssl-dev \
    libsodium-dev \
    libxml2-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Plumber, dplyr, and jsonlite packages from CRAN
RUN R -e "install.packages(c('plumber', 'dplyr', 'jsonlite'), repos='https://cloud.r-project.org/')"

# Setup container directory structure
WORKDIR /usr/src/app

# Copy scripts into the container
COPY prep_dataset.R .
COPY server.R .

# Expose Plumber standard port
EXPOSE 8000

# Start Plumber server listening on all interfaces
ENTRYPOINT ["R", "-e", "pr <- plumber::plumb('server.R'); pr$run(host='0.0.0.0', port=8000)"]
