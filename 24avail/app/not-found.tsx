import Link from "next/link";
export default function NotFound() {
  return (
    <section className="wrap hero" style={{ textAlign: "center" }}>
      <h1 className="display" style={{ margin: "0 auto 10px" }}>404</h1>
      <p className="sub" style={{ margin: "0 auto 20px" }}>الصفحة غير موجودة · Page not found</p>
      <Link className="btn btn-primary" href="/">24avail</Link>
    </section>
  );
}
