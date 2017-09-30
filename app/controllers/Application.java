package controllers;

import play.*;
import play.mvc.*;
import utils.DatabaseUtils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import api.filters.Filters;
import models.*;

public class Application extends Controller {

	public static void index() {
		render();
	}

	public class SQL {
		public static final String GETSPECIES = "select distinct species from hunt.draw_hunt";
	}

	public static void getFilters(){
		Connection conn = new DatabaseUtils().getConnection();
		String speciesSQL = SQL.GETSPECIES;
		JsonArray species = new JsonArray();

		try {
			PreparedStatement pstmt = conn.prepareStatement(speciesSQL);
			ResultSet rs = pstmt.executeQuery();
			JsonObject obj = null;
			int id = 0;
			Logger.info("table sql %s ", speciesSQL);
			while(rs.next()) {
				obj = new JsonObject();
				String specie = rs.getString(1);
				obj.addProperty("id", id);
				obj.addProperty("label", specie);

				species.add(obj);
				id ++;
			}
		} catch(Exception e) {
			Logger.error(e, "Error with sql");
		} finally {
			try {
				conn.close();
			} catch (SQLException e) {
				Logger.error(e, "Error closing connection");
			}
		}
		renderJSON(species.toString());

	}
}