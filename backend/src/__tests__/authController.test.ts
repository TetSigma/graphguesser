import { Request, Response } from "express";
import {
  signup,
  login,
  logout,
  getSession,
} from "../controllers/authController";
import authService from "../services/authService";

jest.mock("../services/authService");

describe("Auth Controller", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  afterEach(() => {
    jest.clearAllMocks();
  });

  //Test for signup logic

  describe("signup", () => {
    it("should create a new user and return success", async () => {
      const req = {
        body: { email: "test@example.com", password: "password" },
      } as Request;

      const user = { id: "1", email: "test@example.com" }; // Mocked user
      (authService.signup as jest.Mock).mockResolvedValue(user);

      await signup(req, res);

      expect(authService.signup).toHaveBeenCalledWith(
        "test@example.com",
        "password"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User created successfully",
        user,
      });
    });

    it("should return error if signup fails", async () => {
      const req = {
        body: { email: "test@example.com", password: "password" },
      } as Request;

      (authService.signup as jest.Mock).mockRejectedValue(
        new Error("Signup failed")
      );

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Signup failed" });
    });
  });

  //Test for login logic

  describe("login", () => {
    it("should log in an existing user", async () => {
      const req = {
        body: { email: "test@example.com", password: "password" },
      } as Request;
      const session = { user: { id: "1" }, token: "abc123" }; // Mocked session
      (authService.login as jest.Mock).mockResolvedValue(session);

      await login(req, res);

      expect(authService.login).toHaveBeenCalledWith(
        "test@example.com",
        "password"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        session,
      });
    });

    it("should return error if login fails", async () => {
      const req = {
        body: { email: "test@example.com", password: "password" },
      } as Request;
      (authService.login as jest.Mock).mockRejectedValue(
        new Error("Login failed")
      );

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Login failed" });
    });
  });

  //Test for logout logic

  describe("Logout Controller", () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should log out successfully", async () => {
      (authService.logout as jest.Mock).mockResolvedValue(undefined);

      await logout(req, res);

      expect(authService.logout).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Logout successful" });
    });

    it("should return an error if logout fails", async () => {
      (authService.logout as jest.Mock).mockRejectedValue(
        new Error("Logout failed")
      );

      await logout(req, res);

      expect(authService.logout).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Logout failed" });
    });
  });

  //Test for getSession

  describe("Get Session Controller", () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return the session if it exists", async () => {
      // Mock session data as expected to be returned from the service
      const sessionData = { sessionId: "123", user: { id: "1" } };

      (authService.getSession as jest.Mock).mockResolvedValue({
        session: sessionData,
      });

      await getSession(req, res);

      expect(authService.getSession).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ session: sessionData });
    });

    it("should return an error if session retrieval fails", async () => {
      const errorMessage = "Session not found";

      // Mocking service to reject with an error
      (authService.getSession as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await getSession(req, res);

      expect(authService.getSession).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
