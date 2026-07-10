export default function Register() {
    return (
        <div>
            <h1>Register</h1>

            <form>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                    />
                </div>

                <button type="submit">
                    Register
                </button>
            </form>
        </div>
    );
}