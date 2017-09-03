package api.filters;

import java.sql.Connection;
import java.sql.SQLException;

import play.Logger;

import utils.DatabaseUtils;
import api.filters.types.Rates;
import api.filters.types.Residency;
import api.filters.types.Species;
import api.filters.types.Unit;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;

public class Filters {

	public static JsonArray getFilters() {
		Connection conn = new DatabaseUtils().getConnection();
		JsonArray array = new JsonArray();

		try {
			array.add(Species.getFilter(conn));			
			array.add(Unit.getUnitFilter(conn)); 
			array.add(Unit.getSubunitFilter(conn));	

			array.add(Rates.getDrawRateFilter(conn));
			array.add(Rates.getHuntSuccessRatefilter(conn));
			array.add(Residency.getFilter(conn));


			conn.close();
		} catch (SQLException e) {
			Logger.error(e,"error in filters");
		}
		return array;
	}



}
