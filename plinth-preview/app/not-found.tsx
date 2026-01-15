import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold tracking-tighter">404</h1>
        <h2 className="text-2xl font-medium">Página no encontrada</h2>
      </div>
      
      <p className="max-w-[31.25rem] text-sm opacity-70">
        Lo sentimos, no pudimos encontrar la página que estás buscando. 
        Puede que haya sido eliminada o que la dirección sea incorrecta.
      </p>

      <Link
        href="/"
        className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </div>
  )
}


