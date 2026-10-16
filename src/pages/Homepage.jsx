import CourseCard from '../components/CourseCard.jsx'
import { courses } from '../data/courses.js'

const footerGroups = [
  {
    title: 'KATEGORI',
    links: ['Digital & Teknologi', 'Pemasaran', 'Manajemen Bisnis', 'Pengembangan Diri', 'Desain'],
  },
  {
    title: 'PERUSAHAAN',
    links: ['Tentang Kami', 'FAQ', 'Kebijakan Privasi', 'Ketentuan Layanan', 'Bantuan'],
  },
  {
    title: 'KOMUNITAS',
    links: ['Tips Sukses', 'Blog'],
  },
]

function Homepage() {
  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-container home-header-inner">
          <a className="home-logo" href="/">
            <span className="home-logo-mark">▶</span>videobelajar
          </a>
          <nav className="home-nav" aria-label="Navigasi utama">
            <a href="#kelas">Kategori</a>
            <a href="/register">Daftar</a>
            <a className="home-avatar" href="/login" aria-label="Buka profil">AR</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="home-hero">
          <div className="home-container home-hero-content">
            <div className="home-hero-label">Belajar kapan saja, di mana saja</div>
            <h1>
              Revolusi Pembelajaran: Temukan<br className="desktop-break" />
              {' '}Ilmu Baru melalui Platform Video Interaktif!
            </h1>
            <p>
              Temukan ilmu baru yang menarik dan mendalam melalui koleksi video pembelajaran
              berkualitas tinggi. Tidak hanya itu, Anda juga dapat berpartisipasi dalam latihan
              interaktif yang akan meningkatkan pemahaman Anda.
            </p>
            <a className="home-green-button" href="#kelas">
              Temukan Video Course untuk Dipelajari!
            </a>
          </div>
        </section>

        <section className="home-course-section" id="kelas">
          <div className="home-container">
            <div className="home-section-heading">
              <div>
                <h2>Koleksi Video Pembelajaran Unggulan</h2>
                <p>Jelajahi berbagai video pembelajaran pilihan kami!</p>
              </div>
            </div>
            <nav className="home-category-nav" aria-label="Kategori kelas">
              <a className="is-active" href="#kelas">Semua Kelas</a>
              <a href="#kelas">Pemasaran</a>
              <a href="#kelas">Desain</a>
              <a href="#kelas">Pengembangan Diri</a>
              <a href="#kelas">Bisnis</a>
            </nav>
            <div className="home-course-grid">
              {courses.map((course) => <CourseCard key={course.title} course={course} />)}
            </div>
          </div>
        </section>

        <section className="home-newsletter" id="newsletter">
          <div className="home-container home-newsletter-inner">
            <div className="home-newsletter-copy">
              <span>NEWSLETTER</span>
              <h2>Mau Belajar Lebih Banyak?</h2>
              <p>
                Daftarkan dirimu untuk mendapatkan informasi terbaru dan penawaran spesial dari
                program-program terbaik.
              </p>
            </div>
            <form className="home-newsletter-form" onSubmit={(event) => event.preventDefault()}>
              <label className="visually-hidden" htmlFor="newsletter-email">Alamat email</label>
              <input id="newsletter-email" type="email" placeholder="Masukkan Emailmu" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="home-footer" id="tentang">
        <div className="home-container">
          <div className="home-footer-grid">
            <div className="home-footer-about">
              <a className="home-logo" href="/">
                <span className="home-logo-mark">▶</span>videobelajar
              </a>
              <p>Gali Potensi Anda Melalui Pembelajaran<br />Video di harioksi.id!</p>
              <address>
                Jl. Usman Effendi No. 50 Lowokwaru, Malang<br />
                <a href="tel:+6287771231234">+62-877-7123-1234</a>
              </address>
            </div>
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                <nav aria-label={group.title}>
                  {group.links.map((link) => (
                    <a href={group.title === 'KATEGORI' ? '#kelas' : '#tentang'} key={link}>
                      {link}
                    </a>
                  ))}
                </nav>
              </div>
            ))}
          </div>
          <div className="home-footer-bottom">
            <span>©2023 Gerobak Sayur All Rights Reserved.</span>
            <div className="home-socials">
              <a href="#tentang" aria-label="LinkedIn">in</a>
              <a href="#tentang" aria-label="Facebook">f</a>
              <a href="#tentang" aria-label="Instagram">ig</a>
              <a href="#tentang" aria-label="Twitter">x</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage