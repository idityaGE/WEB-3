mod config;
mod handlers;
mod models;
mod routes;

use axum::{Router, routing::get};
use config::init;
use routes::health::health_route;

#[tokio::main]
async fn main() {
    init();
    let app = Router::new()
        .route("/", get(|| async { "Hello Axum" }))
        .route("/health", get(health_route));

    println!("🚀 Server running on http://localhost:3000");
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();
    axum::serve(listener, app).await.unwrap();
}
