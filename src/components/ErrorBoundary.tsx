import React, { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  tieneError: boolean;
  error: Error | null;
}

// TODO [D]: error boundary (solo existe como componente de clase)
// - getDerivedStateFromError: guardar { tieneError: true, error }
// - componentDidCatch: console.error del error y de info.componentStack
// - si hay error: mostrar fallback o una tarjeta con el mensaje
//   y un boton "Intentar de nuevo" que limpie el state
// se puede probar en /laboratorio
export class ErrorBoundary extends Component<Props, State> {
  state: State = { tieneError: false, error: null };
  static getDerivedStateFromError(error: Error): State {
    return {
      tieneError: true,
      error,
    };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error(error, info.componentStack);
  }
  render() {
    if (this.state.tieneError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div>
          <h2>Algo salió mal!</h2>
          <p>{this.state.error?.message}</p>
          <button
            onClick={() =>
              this.setState({
                tieneError: false,
                error: null,
              })
            }
          >
            Intentar de nuevo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
