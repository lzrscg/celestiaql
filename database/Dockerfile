FROM postgres
ENV POSTGRES_USER docker
ENV POSTGRES_PASSWORD docker
ENV POSTGRES_DB bdjuno
COPY schema/* /docker-entrypoint-initdb.d/

EXPOSE 5432