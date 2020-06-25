defmodule ElixirWebsocket.Repo do
  use Ecto.Repo,
    otp_app: :elixir_websocket,
    adapter: Ecto.Adapters.Postgres
end
