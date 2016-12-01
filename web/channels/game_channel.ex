defmodule Shoom.GameChannel do
  use Shoom.Web, :channel

  @step 10

  def join("game", %{"nick" => nick}, socket) do
    socket = assign(socket, :user_id, nick)
    socket = assign(socket, :position, {0, 0})
    {:ok, socket}
  end

  def handle_in("move", direction, socket) do
    socket = update_position(socket, direction)
    {x, y} = socket.assigns.position
    broadcast! socket, "position", %{"pos" => %{"x" => x, "y" => y}, "user_id" => socket.assigns.user_id}
    {:noreply, socket}
  end

  defp update_position(socket, %{"angle" => angle, "keydown" => true}) do
    {x, y} = socket.assigns.position
    x = :math.cos(angle) * @step
    y = :math.sin(angle) * @step
    assign(socket, :position, {x, y})
  end
end
