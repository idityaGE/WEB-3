use axum::{Json};
use crate::models::response::HealthResponse;

pub async fn check_health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "OK".to_string(),
        message: "Service is running".to_string(),
    })
}
