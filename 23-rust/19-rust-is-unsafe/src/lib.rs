use std::slice;

pub fn split_at_mut(slice: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    let len = slice.len();
    assert!(mid <= len);
    // borowing mutably same value two time, but we know our code is correct
    // (&mut slice[..mid], &mut slice[mid..])

    // let ptr = slice.as_mut_ptr();
    let ptr = slice as *mut [i32] as *mut i32;
    unsafe {
        (
            slice::from_raw_parts_mut(ptr, mid),
            slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}
