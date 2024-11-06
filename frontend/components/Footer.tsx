import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background text-muted-foreground">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()}, YPigeon by{" "}
            <a
              href="https://www.passlimits.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              PassLimits
            </a>
            . All rights reserved.
          </p>
          <nav className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
