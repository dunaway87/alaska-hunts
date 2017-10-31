package api.filters;

import java.sql.Connection;
import java.sql.SQLException;

import play.Logger;

import utils.DatabaseUtils;
import api.filters.types.Rates;
import api.filters.types.Residency;
import api.filters.types.Season;
import api.filters.types.Species;
import api.filters.types.Unit;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

public class Filters {

	public static JsonObject getFilters() {
		Connection conn = new DatabaseUtils().getConnection();
		JsonObject array = new JsonObject();

		try {
			array.add("species",Species.getFilter(conn));			
			array.add("unit",Unit.getUnitFilter(conn)); 
			array.add("subunit", Unit.getSubunitFilter(conn));
			array.add("drawrate",Rates.getDrawRateFilter(conn));
			array.add("successrate",Rates.getHuntSuccessRatefilter(conn));
			array.add("residence",Residency.getFilter(conn));
			array.add("season", Season.getFilter());

			conn.close();
		} catch (SQLException e) {
			Logger.error(e,"error in filters");
		}
		return array;
	}







}
/*Connection conn = new DatabaseUtils().getConnection();
		JsonArray array = new JsonArray();

		try {
			array.add(Species.getFilter(conn));	*/		
/*array.add(Unit.getUnitFilter(conn)); 
			array.add(Unit.getSubunitFilter(conn));	

			array.add(Rates.getDrawRateFilter(conn));
			array.add(Rates.getHuntSuccessRatefilter(conn));
			array.add(Residency.getFilter(conn));
 */
/*
			conn.close();
		} catch (SQLException e) {
			Logger.error(e,"error in filters");
		}
		return array;
	}
 */


