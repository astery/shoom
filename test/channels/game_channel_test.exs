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
    push socket, "move", %{"angle" => 1.5707963268, "keydown" => true}
    assert_broadcast "position", %{"user_id" => ^nick, "pos" => %{"x" => x, "y" => y}}
    assert_in_delta(0, x, 0.01)
    assert_in_delta(10, y, 0.01)
  end
end
