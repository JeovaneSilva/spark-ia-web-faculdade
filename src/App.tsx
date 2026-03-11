import { DashboardLayout } from "./layouts/DashboardLayout";
import { Card } from "./components/ui/Card";
import { Button } from "./components/ui/Button";

function App() {
  return (
    <DashboardLayout>
      <header className="mb-8">
        <h1>Chatbot Spark</h1>
      </header>

      <section className="grid gap-8">
        <Card title="Exemplo Card">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Button variant="primary">Botao Primario</Button>
              <Button variant="outline">Botao vazado</Button>
            </div>
          </div>
        </Card>
      </section>
    </DashboardLayout>
  );
}

export default App;