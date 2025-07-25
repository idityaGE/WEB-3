// Rust doesn't know if the FF is safe are not, that's why we need to put these into unsafe block
unsafe extern "C" {
    // fn abs(input: i32) -> i32;
    // safe keyword to say that this specific function is safe to call even though it is in an unsafe extern block
    safe fn abs(input: i32) -> i32;
}

// Global Variable (SCREAMING_SNAKE_CASE)
static HELLO_WORLD: &str = "Hello, world";
// static varible have a fixed address in memory, but as for const it can change 


static mut COUNTER: u32 = 0;
/// SAFETY: Calling this from more than a single thread at a time is undefined
/// behavior, so you *must* guarantee you only call it from a single thread at
/// a time.
unsafe fn add_to_count(inc: u32) {
    unsafe {
        COUNTER += inc;
    }
}

// Implementing an Unsafe Trait
unsafe trait Foo {
    // methods go here
}

unsafe impl Foo for i32 {
    // method implementations go here
}


fn main() {
    // unsafe {
    //     println!("absolute value of -3 in C = {}", abs(-3));
    // }
    println!("absolute value of -3 in C = {}", abs(-3));

    println!("static variable : {}", HELLO_WORLD);

    unsafe {
        // SAFETY: This is only called from a single thread in `main`.
        add_to_count(3);
        println!("COUNTER: {}", *(&raw const COUNTER));
    }
}

// this anotation tell the compiler to not change the name of function when compiling
// This is unsafe because there might be name collisions across libraries without the built-in mangling,
// so it is our responsibility to make sure the name we choose is safe to export without mangling.
#[unsafe(no_mangle)]
pub extern "C" fn call_from_c() {
    println!("this func called from c");
}
