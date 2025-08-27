import api from "../api";

declare const global: any;

describe("api", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("list fetches products", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1 }],
      status: 200,
      statusText: "OK",
    });
    const res = await api.list();
    expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/produtos$/));
    expect(res).toEqual([{ id: 1 }]);
  });

  test("getById fetches product by id", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 5 }),
      status: 200,
      statusText: "OK",
    });
    const res = await api.getById(5);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/produtos\/5$/));
    expect(res).toEqual({ id: 5 });
  });

  test("create posts product", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 2, name: "x" }),
      status: 201,
      statusText: "Created",
    });
    const res = await api.create({ name: "x", annualInterestRate: 10, maximumTerm: 10 });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/produtos$/),
      expect.objectContaining({ method: "POST" }),
    );
    expect(res.id).toBe(2);
  });

  test("update puts product", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 3, name: "y" }),
      status: 200,
      statusText: "OK",
    });
    const res = await api.update(3, { name: "y", annualInterestRate: 10, maximumTerm: 10 });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/produtos\/3$/),
      expect.objectContaining({ method: "PUT" }),
    );
    expect(res.id).toBe(3);
  });

  test("patch updates product partially", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 4, name: "z" }),
      status: 200,
      statusText: "OK",
    });
    const res = await api.patch(4, { name: "z" });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/produtos\/4$/),
      expect.objectContaining({ method: "PATCH" }),
    );
    expect(res.id).toBe(4);
  });

  test("remove deletes product", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => "",
      status: 204,
      statusText: "No Content",
    });
    await api.remove(6);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/produtos\/6$/),
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  test("errors propagate with message", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => "boom",
      status: 500,
      statusText: "Server Error",
    });
    await expect(api.list()).rejects.toThrow(/500/);
  });

  test("remove throws on error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => "nope",
      status: 400,
      statusText: "Bad Request",
    });
    await expect(api.remove(1)).rejects.toThrow(/400/);
  });
});
