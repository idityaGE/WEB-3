use std::collections::HashMap;

fn main() {
    let _x: u32 = 22;
    let _y: i32 = -22;
    let _z: f32 = 22.999;
    let _b: bool = true;
    let _c: char = 'A';
    let _l: &str = "Aditya"; // string_litral immutable
    let _s: String = String::from("Aditya");
    let _t: (i32, f32, bool) = (22, 2.3, false);
    let _a: [i32; 3] = [32, 4, 1];
    let _sl: &[i32] = &_a;
    struct Person {
        name: String,
        age: u8,
        is_active: bool,
    }
    let _me: Person = Person {
        name: String::from("Aditya"),
        age: 20,
        is_active: false,
    };

    // Options<T> => value might be available or not available
    // Some(T) = value is present
    // None = no value
    let _o: Option<u32> = Some(10);
    match _o {
        Some(val) => println!("{}", val),
        None => println!("Value not available"),
    }

    // Result<T, E> => an operation might fail
    // Ok(T) = success with a result value
    // Err(E) = failure with an error
    // If this instance of Result is an Err value, expect will cause the program to crash and display the message that you passed as an argument to expect. 
    fn divide(a: f64, b: f64) -> Result<f64, String> {
        if b == 0.0 {
            return Err("cannot be divided by zero".to_string());
        } else {
            Ok(a / b)
        }
    }

    match divide(10.0, 0.0) {
        Ok(result) => println!("Result: {}", result),
        Err(e) => println!("Error: {}", e),
    }

    // first order function
    let _sum: fn(i32, i32) -> i32 = |a, b: i32| -> i32 { a + b };

    // enum [enumeration]
    enum Color { 
        Red = 0, // We call each possible state a variant.
        Blue = 1,
        Yellow = 2,
    }
    let color = Color::Red;
    match color {
        Color::Red => println!("Red"),
        Color::Blue => println!("Blue"),
        Color::Yellow => println!("Yellow"),
    }

    // hashmap
    let mut scores: HashMap<String, u16> = HashMap::new();
    scores.insert("Aditya".to_string(), 92);
    scores.insert("Ravi".to_string(), 88);
    if let Some(score) = scores.get("Aditya") {
        println!("Aditya's score is {}", score);
    }
    let entry = scores.entry("Charlie".to_string()).or_insert(33); // inserts only if "Charlie" doesn't exist
    *entry += 1; // increments Charlie's score by 1
    for (name, score) in &scores {
        println!("{}: {}", name, score);
    }
    scores.remove("Ravi");
    let _is_available = scores.contains_key("Aditya");

    // vector
    let _fruits: Vec<&str> = vec!["apple", "mango", "banana"];
    let vec: Vec<i32> = vec![1; 3]; // [1,1,1]
    println!("{:?}", vec);
    
    for fruit in _fruits {
        println!("{}", fruit);
    }

    let mut v = Vec::new();
    v.push(5);
    v.push(6);
    v.push(7);

    for i in &v {
        println!("{}", i);
    }
}
