use std::env;

pub fn init() {
    dotenvy::dotenv().ok();
    let port = env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    println!("Configured to run on port: {}", port);
}
