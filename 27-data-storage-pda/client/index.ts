class UserData {
  name: string = "";
  age: number = 0;
  email: string = "";
  created_at: bigint = BigInt(0);

  constructor(fields?: { name: string, age: number, email: string, created_at: bigint }) {
    if (fields) {
      this.name = fields.name;
      this.age = fields.age;
      this.email = fields.email;
      this.created_at = fields.created_at;
    }
  }
}

// Borsh schema for deserialization
const userDataSchema = new Map([
  [UserData, {
    kind: 'struct',
    fields: [
      ['name', 'string'],
      ['age', 'u8'],
      ['email', 'string'],
      ['created_at', 'i64']
    ]
  }]
]);

export { userDataSchema, UserData }
