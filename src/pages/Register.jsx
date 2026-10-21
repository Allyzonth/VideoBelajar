import { Link } from 'react-router-dom'
import FormField from '../components/FormField.jsx'

function Register() {
  function handleSubmit(event) {
    event.preventDefault()

    const form = event.currentTarget
    const password = form.elements.namedItem('password')
    const confirmation = form.elements.namedItem('confirm-password')

    if (password.value !== confirmation.value) {
      confirmation.setCustomValidity('Konfirmasi kata sandi belum sama.')
      confirmation.reportValidity()
      return
    }

    confirmation.setCustomValidity('')
  }

  return (
    <main className="auth-page">
      <section className="auth-shell" aria-labelledby="register-title">
        <Link className="logo auth-brand" to="/">
          <img src="/assets/images/Logo.png" alt="VideoBelajar" />
        </Link>
        <h1 id="register-title">Buat akun baru</h1>
        <p className="auth-intro">Mulai belajar dan kembangkan potensimu bersama kami.</p>
        <form onSubmit={handleSubmit}>
          <FormField
            id="register-name"
            label="Nama"
            name="name"
            type="text"
            placeholder="Nama lengkap"
            autoComplete="name"
            required
          />
          <FormField
            id="register-email"
            label="E-mail"
            name="email"
            type="email"
            placeholder="nama@email.com"
            autoComplete="email"
            required
          />
          <FormField
            id="register-phone"
            label="Nomor HP"
            name="phone"
            type="tel"
            placeholder="08xxxxxxxxxx"
            autoComplete="tel"
            required
          />
          <FormField
            id="register-password"
            label="Kata Sandi"
            name="password"
            type="password"
            placeholder="Minimal 8 karakter"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <FormField
            id="register-confirm"
            label="Konfirmasi Kata Sandi"
            name="confirm-password"
            type="password"
            placeholder="Ulangi kata sandi"
            autoComplete="new-password"
            onInput={(event) => event.currentTarget.setCustomValidity('')}
            required
          />
          <button className="btn btn-primary btn-full" type="submit">Daftar</button>
        </form>
        <div className="auth-divider">atau</div>
        <button className="btn btn-ghost btn-full" type="button">
          <span className="google-mark">G</span> Daftar dengan Google
        </button>
        <p className="auth-switch">
          Sudah punya akun? <Link className="text-link accent" to="/login">Masuk di sini</Link>
        </p>
      </section>
    </main>
  )
}

export default Register