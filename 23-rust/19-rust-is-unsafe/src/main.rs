// Unsafe
/*
- Dereference a raw pointer
- Call an unsafe function or method
- Access or modify a mutable static variable
- Implement an unsafe trait
- Access fields of a union
*/

/*
Different from references and smart pointers, raw pointers:

    Are allowed to ignore the borrowing rules by having both immutable and mutable pointers or multiple mutable pointers to the same location
    Aren’t guaranteed to point to valid memory
    Are allowed to be null
    Don’t implement any automatic cleanup
 */

fn main() {
    let mut num = 5;
    let r1 = &raw const num;
    let r2 = &raw mut num;

    let _r1 = &num as *const i32;
    let _r2 = &mut num as *mut i32;

    // We can create raw pointers in safe code; we just can’t dereference raw pointers outside an unsafe block
    // println!("r1 is: {}", *r1);
    unsafe {
        println!("r1 is: {}", *r1);
        println!("r2 is: {}", *r2);
    }

    // let address = 0x012345usize;
    // let r = address as *const i32;

    // Unsafe Fn
    unsafe fn dangerous() {}

    unsafe {
        dangerous();
    }

    let mut v = vec![1, 2, 3, 4, 5, 6];
    let r = &mut v[..];
    let (a, b) = r.split_at_mut(3); // this is an safe abstractionn over an unsafe code
    assert_eq!([1, 2, 3], a);
    assert_eq!([4, 5, 6], b);
}


