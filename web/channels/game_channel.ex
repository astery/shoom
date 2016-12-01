defmodule Shoom.GameChannel do
  use Shoom.Web, :channel

  def join("game", %{"nick" => nick}, socket) do
    socket = assign(socket, :user_id, nick)
    {:ok, socket}
  end

  def handle_in("send_position", %{"x" => x, "y" => y} = position, socket) do
    broadcast! socket, "position", %{pos: position, user: socket.assigns.user_id}
    {:noreply, socket}
  end
end
