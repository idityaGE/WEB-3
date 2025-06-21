fn main() {
    let x: i32 = sum(1, 5);
    println!("{}", x);
    println!("Hello Rust");
}

fn sum(a: i32, b: i32) -> i32 {
    return a + b;
}
