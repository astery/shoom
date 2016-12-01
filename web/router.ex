defmodule Shoom.Router do
  use Shoom.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", Shoom do
    pipe_through :api
  end
end
