export default function Footer() {
  return (
    <footer className="bg-liora-950 py-8 pb-24 text-center text-liora-200 md:pb-8">
      <p className="text-xl font-black text-white">
        Liora<span className="text-gold-400">.</span>
      </p>
      <p className="mt-2 text-sm">
        © {new Date().getFullYear()} Liora — كل الحقوق محفوظة
      </p>
    </footer>
  );
}
