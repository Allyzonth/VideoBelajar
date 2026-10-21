import { Link } from 'react-router-dom'
import FormField from '../components/FormField.jsx'

function Login() {
  return (
    <main className="auth-page">
      <section className="auth-shell" aria-labelledby="login-title">
        <Link className="logo auth-brand" to="/">
          <img src="/assets/images/Logo.png" alt="VideoBelajar" />
        </Link>
        <h1 id="login-title">Selamat datang</h1>
        <p className="auth-intro">Masuk untuk perjalanan belajarmu yang menyenangkan.</p>
        <form onSubmit={(event) => event.preventDefault()}>
          <FormField
            id="login-email"
            label="Email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            autoComplete="email"
            required
          />
          <FormField
            id="login-password"
            label="Password"
            name="password"
            type="password"
            placeholder="Masukkan password"
            autoComplete="current-password"
            required
          />
          <div className="form-row">
            <span />
            <a className="text-link accent" href="#lupa-password">Lupa Password?</a>
          </div>
          <button className="btn btn-primary btn-full" type="submit">Masuk</button>
        </form>
        <div className="auth-divider">atau</div>
        <button className="btn btn-ghost btn-full" type="button">
          <span className="google-mark">G</span> Masuk dengan Google
        </button>
        <p className="auth-switch">
          Belum punya akun? <Link className="text-link accent" to="/register">Daftar sekarang</Link>
        </p>
      </section>
    </main>
  )
}

export default Login