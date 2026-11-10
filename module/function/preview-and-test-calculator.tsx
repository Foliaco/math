
'use client';
import React, { useMemo, useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

type PreviewAndTestCalculatorProps = {
    latex: string;
    variables: string[];
    code: string;
};

export const PreviewAndTestCalculator = ({
    latex,
    variables,
    code
}: PreviewAndTestCalculatorProps) => {

    const [values, setValues] = useState<Record<string, string>>({});
    const [result, setResult] = useState<number | string | null>(null);
    const [error, setError] = useState("");

    // Validar y compilar el código recibido desde DB.
    const calculator = useMemo(() => {
        try {
            if (!variables.every(v => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(v))) {
                throw new Error("Nombre de variable inválido");
            }

            if (new Set(variables).size !== variables.length) {
                throw new Error("Hay variables duplicadas");
            }

            return new Function(...variables, code) as (...args: number[]) => number;
        } catch (err) {
            return null;
        }
    }, [variables, code]);

    const calculate = () => {
        try {
            setError("");
            setResult(null);

            if (!calculator) {
                throw new Error("El código de la función no es válido");
            }

            const args = variables.map(variable => {
                const value = values[variable];

                if (value === undefined || value.trim() === "") {
                    throw new Error(`Ingresa el valor de ${variable}`);
                }

                const number = Number(value);

                if (!Number.isFinite(number)) {
                    throw new Error(`El valor de ${variable} no es válido`);
                }

                return number;
            });

            const output = calculator(...args);
            console.log(output)
            if (Array.isArray(output)) {
                setResult(output.join(", "));
            } else if (typeof output !== "number" || !Number.isFinite(output)) {
                throw new Error("La función no devolvió un resultado numérico válido");
            }
            else {
                setResult(output);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al calcular");
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-5">

            {/* Fórmula */}
            <section className="rounded-sm border border-base-300 p-5 space-y-3">
                <h3 className="font-semibold text-lg">
                    Fórmula matemática
                </h3>

                <div className="overflow-x-auto text-center py-4">
                    <BlockMath math={latex} />
                </div>
            </section>

            {/* Calculadora */}
            <section className="rounded-sm border border-base-300 p-5 space-y-5">

                <div>
                    <h3 className="font-semibold text-lg">
                        Probar función
                    </h3>
                    <p className="text-sm text-base-content/60">
                        Introduce los valores para calcular el resultado.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {variables.map(variable => (
                        <label key={variable} className="space-y-2">
                            <span className="text-sm font-medium">
                                Variable {variable}
                            </span>

                            <input
                                type="number"
                                step="any"
                                className="input w-full"
                                placeholder={`Valor de ${variable}`}
                                value={values[variable] ?? ""}
                                onChange={e => {
                                    setValues(prev => ({
                                        ...prev,
                                        [variable]: e.target.value
                                    }));
                                    setResult(null);
                                    setError("");
                                }}
                            />
                        </label>
                    ))}

                </div>

                <button
                    type="button"
                    onClick={calculate}
                    className="btn btn-primary w-full"
                >
                    Calcular
                </button>

                {/* Resultado */}
                {result !== null && (
                    <div className="rounded-lg bg-base-200 p-5 space-y-2">
                        <span className="text-sm text-base-content/60">
                            Resultado
                        </span>

                        <p className="text-3xl font-bold break-all">
                            {result}
                        </p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="alert alert-error text-sm">
                        {error}
                    </div>
                )}

            </section>
        </div>
    );
};
