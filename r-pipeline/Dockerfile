FROM rocker/r-ver:4.3.0
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
    libssl-dev \
    libcurl4-openssl-dev \
    libsodium-dev \
    libxml2-dev \
    && rm -rf /var/lib/apt/lists/*
RUN R -e "install.packages(c('plumber', 'dplyr', 'jsonlite'), repos='https://cloud.r-project.org/')"
WORKDIR /usr/src/app
COPY prep_dataset.R .
COPY server.R .
EXPOSE 8000
ENTRYPOINT ["R", "-e", "pr <- plumber::plumb('server.R'); pr$run(host='0.0.0.0', port=8000)"]
