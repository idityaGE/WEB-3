use add_one::add_one;
fn main() {
    let mut num = 5;
    num = add_one(num);
    assert_eq!(num, 6);
    println!("{}", num);
}

// cargo run -p adder 
