defmodule ElixirWebsocketWeb.RoomController do
  use ElixirWebsocketWeb, :controller

  def show(conn, _params) do
    render(conn, "show.html")
  end
end
