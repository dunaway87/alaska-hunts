package controllers;

import play.*;
import play.mvc.*;
import play.vfs.VirtualFile;
import utils.DatabaseUtils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

import org.geotools.geojson.geom.GeometryJSON;



import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

import api.PointData;
import api.filters.Filters;
import api.filters.types.Unit;



public class Application extends Controller {

	public static void index() {
		render();
	}

	public class SQL {
		public static final String GETSPECIES = "select distinct species from hunt.draw_hunt";
	}

	public static void getFilters(){

		JsonObject filters = Filters.getFilters();



		renderJSON(filters.toString());
	}
	public static void getPointData(double lat, double lon, String season, String unit, String subunit, String draw_rate, String hunt_success_rate, String residency, int legalAnimal, int species ){
		JsonElement hunts = PointData.getData(lat,lon, season, unit, subunit, draw_rate, hunt_success_rate, residency, legalAnimal, species);

		renderJSON(hunts);

	}


}




