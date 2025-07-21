use blog_sdp::Post;

fn main() {
    let mut post = Post::new();
    post.add_text("Hello");

    assert_eq!("", post.content());

    post.request_review();
    assert_eq!("", post.content());

    post.approve();
    assert_eq!("Hello", post.content());
}
