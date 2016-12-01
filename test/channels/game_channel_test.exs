defmodule Shoom.GameChannelTest do
  use Shoom.ChannelCase, async: true

  alias Shoom.GameChannel

  setup do
    nick = "nick"
    {:ok, _, socket} =
      socket("user:id", %{})
      |> subscribe_and_join(GameChannel, "game", %{"nick" => nick})
    {:ok, %{socket: socket, nick: nick}}
  end

  test "one player sends positions", %{socket: socket, nick: nick} do
    pos = %{"x" => 0, "y" => 1}
    push socket, "send_position", pos
    broadcast_from socket, "position", %{"user_id" => nick, "pos" => pos}
  end
end
