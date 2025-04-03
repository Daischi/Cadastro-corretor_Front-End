export default function AvatarCorretor({ nome }) {
    const iniciais = nome
        ? nome
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
        : "??"

    return (
        <div className="flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-medium border border-emerald-200">
                {iniciais}
            </div>
        </div>
    )
}

