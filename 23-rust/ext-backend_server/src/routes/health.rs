use axum::response::IntoResponse;
use crate::handlers::health_handler::check_health;

pub async fn health_route() -> impl IntoResponse {
    check_health().await
}
