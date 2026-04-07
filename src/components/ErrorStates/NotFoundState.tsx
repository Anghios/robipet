export default function NotFoundState() {
  return (
    <div className="flex-1 bg-slate-900 p-6 flex items-center justify-center">
      <div className="bg-slate-800 border border-slate-700 text-slate-300 p-8 rounded-2xl text-center max-w-md">
        <div className="text-6xl mb-4">🐾</div>
        <h3 className="text-2xl font-bold mb-3">No se encontró ninguna mascota</h3>
        <p className="mb-6 text-slate-400">
          Parece que aún no has agregado ninguna mascota a tu cuenta.
        </p>
        <a 
          href="/pets" 
          className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Añadir nueva mascota
        </a>
      </div>
    </div>
  );
}