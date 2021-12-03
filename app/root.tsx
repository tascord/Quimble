import { Link, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from "remix";
import type { LinksFunction } from "remix";

import TypogLight from './media/typography_light.svg';
import LogoLight from './media/logo_light.svg';
import { useState } from "react";
import { Stater } from "./helpers/stater";

const DefaultLinks = [
  <Link to="/about">About</Link>,
  <Link to="/support">Support</Link>,
  <Link to="/dash">Explore</Link>
]

export let links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: '/tailwind' }
  ];
};

export default function App(props: any) {

  const [links, setLinks] = useState<JSX.Element[]>(DefaultLinks);
  Stater.on('context_menu.set_menu', (links) => setLinks(links));
  Stater.on('context_menu.add_to_default', item => {

    let new_links = [...DefaultLinks];

    let old = new_links.findIndex(l => l.props.to === item.props.to);
    if (old !== -1) new_links[old] = item;
    else new_links.push(item);

    setLinks(new_links);

  });

  Stater.on('context_menu.add_item', item => {

    let new_links = [...links];

    let old = new_links.findIndex(l => l.props.to === item.props.to);
    if (old !== -1) new_links[old] = item;
    else new_links.push(item);

    setLinks(new_links);

  });

  Stater.on('context_menu.reset', () => {
    setLinks(DefaultLinks);
  })

  return (
    <Document title="Quimble">
      <Layout links={links}>
        <Outlet />
      </Layout>
    </Document>
  );

}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Quimble — Uh Oh!">
      <Layout>
        <section className="error">
          <h1>There was an error</h1>
          <p className="text-gray-500">{error.message}</p>
          <hr className="my-4" />
          <p className="text-green-400 text-2xl">
            Something we weren't expecting happened.
            Maybe try that again?
          </p>
        </section>
      </Layout>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  return (
    <Document title={`${caught.status} — ${caught.statusText}`}>
      <Layout>
        <section className="error" style={{
          backgroundImage: `url('https://http.cat/${caught.status}')`
        }}>
        </section>
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({ children, links }: { children: React.ReactNode, links?: JSX.Element[] }) {

  links = links ?? [];
  if (links.length === 0) links = DefaultLinks;

  return (

    <>

      <header>
        <h1>
          <Link to="/">
            <img src={TypogLight} alt="Quimble Logo" className="h-10" />
          </Link>
        </h1>
        <nav>
          {
            links.map((l, i) => ({
              ...l, key: i
            }))
          }
        </nav>
      </header>

      <main>
        {children}
      </main>

      <footer>
        <section className="content">
          <div className="blabber">
            <h1>Powered by students</h1>
            <p>
              Quimble, while school supported, is entirely run buy students for both comfort and control.
            </p>
          </div>
          <ul>
            <li> <h2>Info</h2> </li>
            <li> <Link to="/about">About</Link> </li>
            <li> <Link to="/support">Support</Link> </li>
          </ul>

        </section>

        <hr />

        <section className="closing">
          <img src={LogoLight} alt="Quimble Logo" className="h-12" />
          <Link to="/dash">Explore Quimble</Link>
        </section>
      </footer>

    </>
  )

};