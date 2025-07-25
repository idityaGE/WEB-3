use trait_objeccts::{Button, Draw, Screen};

struct SelectBox {
    width: u32,
    height: u32,
    options: Vec<String>,
}

impl Draw for SelectBox {
    fn draw(&self) {
        // draw here
    }
}

fn main() {
    let screen = Screen {
        components: vec![
            // Box::new(String::from("test")),
            Box::new(SelectBox {
                width: 20,
                height: 30,
                options: vec![
                    String::from("yes"),
                    String::from("no"),
                    String::from("may be"),
                ],
            }),
            Box::new(Button {
                width: 50,
                height: 20,
                lable: String::from("Boom"),
            }),
        ],
    };

    screen.run();
}
