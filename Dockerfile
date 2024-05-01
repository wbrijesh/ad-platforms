FROM golang:latest AS build-env

WORKDIR /app

COPY go.mod ./
COPY go.sum ./

RUN go mod download

COPY . .

RUN go build -o main cmd/main.go

#FROM gcr.io/distroless/base-debian11
FROM alpine:latest

WORKDIR /app

COPY --from=build-env /app/main /app/

ENTRYPOINT ["/app/main"]