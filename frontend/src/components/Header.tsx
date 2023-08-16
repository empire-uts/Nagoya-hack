import Link  from "next/link";

export const Header = () => {
  return(
    <div className="flex gap-28 p-4 items-center border-b border-zinc-200">
      <h1 className="ml-8 text-xl font-semibold text-gray-800">Title</h1>
      <ul className="flex gap-10 mr-6 text-gray-400 font-light">
        <li>
          <Link href="/" className="hover:text-gray-800">Home</Link>
        </li>
        <li>
          <Link href="/register" className="hover:text-gray-800">Register</Link>
        </li>
      </ul>
    </div>
  )
}