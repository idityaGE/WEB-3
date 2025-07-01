use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
struct User {
    username: String,
    password: String,
    age: u8,
}

#[derive(Debug, PartialEq, Serialize, Deserialize)]
struct MyStruct {
    id: u64,
    data: String,
    v: Vec<u32>,
    user: User
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

    println!();

    let s = MyStruct {
        id: 32,
        data: String::from("Harkirtat"),
        v: vec![1, 2, 3],
        user: User {
            username: String::from("Aditya"),
            password: String::from("Maurya"),
            age: 20
        }
    };

    let json_str = serde_yaml::to_string(&s).unwrap();
    println!("{}", json_str);
    let deserialized: MyStruct = serde_yaml::from_str(&json_str).unwrap();
    println!("{:?}", deserialized);
    
}
