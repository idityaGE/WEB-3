use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
struct User {
    username: String,
    password: String,
    age: u8,
}

fn main() {
    let u = User {
        username: "Aditya".to_string(),
        password: "not_gonna_tell_you".to_string(),
        age: 20,
    };

    let st = serde_json::to_string(&u).unwrap();
    println!("{}", st); // {"username":"Aditya","password":"not_gonna_tell_you","age":20}
 
    let us: Result<User, serde_json::Error> = serde_json::from_str(&st);
    match us {
        Ok(user) => println!("{:?}", user), // User { username: "Aditya", password: "not_gonna_tell_you", age: 20 }
        Err(_) => println!("Error")
    }
}
