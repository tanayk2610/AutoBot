package selenium.tests;

import static org.junit.Assert.*;

import java.util.LinkedHashMap;
import java.util.Set;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)

public class SeleniumSlackTest {
	private static WebDriver driver;

	@BeforeClass
	public static void setUp() throws Exception {
		// driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();

		driver.get("https://slackbotpractice.slack.com/");

		// Wait until page loads and we can see a sign in button.
		WebDriverWait wait = new WebDriverWait(driver, 500);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));
		email.sendKeys("autobotsel@gmail.com");
		pw.sendKeys("autobotsel123");

		// Click
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();

		// Wait until we go to general channel.
		wait.until(ExpectedConditions.titleContains("general"));

		// Go to the AutoBot Channel
		driver.get("https://slackbotpractice.slack.com/messages/Autobot/");
		wait.until(ExpectedConditions.titleContains("AutoBot"));

	}

	@AfterClass
	public static void tearDown() throws Exception {
		driver.close();
		driver.quit();
	}

	// Test Interaction
	@Test
	public void testA() throws Exception {

		WebDriverWait wait = new WebDriverWait(driver, 50);
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);

		// Say "Hello" as the user
		Actions sendTextActions = new Actions(driver);
		sendTextActions.moveToElement(messageBot);
		sendTextActions.click();
		sendTextActions.sendKeys("Hello");
		sendTextActions.sendKeys(Keys.RETURN);
		sendTextActions.build().perform();

		// wait until we get reply from AutoBot
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(
				"(//div[@class='day_msgs']//span[@class='message_body'])[last()][.='Hello, Selenium Autobot']")));

		WebElement message = driver
				.findElement(By.xpath("(//div[@class='day_msgs']//span[@class='message_body'])[last()]"));
		assertEquals(message.getText(), "Hello, Selenium Autobot");
	}

	// Test Save Keys
	@Test
	public void testB() throws Exception {

		// Happy Path
		LinkedHashMap<String, String> convoSeq = new LinkedHashMap<String, String>();
		convoSeq.put("save Digital Ocean keys", "Please provide token for your Digital Ocean Account.");
		convoSeq.put("8f057609f00e98176c3edeeef5af00fc2588c2d5449845f7158ebbd1e2201fc7", "Please provide ssh key id for your digital ocean account.");
		convoSeq.put("12345678", "Keys Saved successfully");
		conversation(convoSeq);
	}

	// USE CASE 1 - Test Create VM
	@Test
	public void testC() throws Exception {

		// Happy Path
		LinkedHashMap<String, String> convoSeq = new LinkedHashMap<String, String>();
		convoSeq.put("create a vm",
				"What kind of operating system you would like? Digital Ocean supports Ubuntu, FreeBSD, Fedora, Debian, CoreOS, CentOS");
		convoSeq.put("Ubuntu", "Please specify the configuration you want? (example: 512mb, 1gb)");
		convoSeq.put("512mb",
				"Type **plain** to get a plain Vm OR Type **flavored** to add jenkins flavor on top of your VM");
		convoSeq.put("plain", "Your VM is hosted at IP address: 104.131.186.241");
		conversation(convoSeq);

		// Happy Path for flavored
		convoSeq = new LinkedHashMap<String, String>();
		convoSeq.put("create a vm",
				"What kind of operating system you would like? Digital Ocean supports Ubuntu, FreeBSD, Fedora, Debian, CoreOS, CentOS");
		convoSeq.put("Ubuntu", "Please specify the configuration you want? (example: 512mb, 1gb)");
		convoSeq.put("512mb",
				"Type **plain** to get a plain Vm OR Type **flavored** to add jenkins flavor on top of your VM");
		convoSeq.put("flavored", "Please provide your private Key so that I can access your droplet");
		convoSeq.put("qwertyuioasdfghjkzxcvbnm", "Your VM is hosted at IP address: 104.131.186.241");

		conversation(convoSeq);

		// Sad Path
		convoSeq = new LinkedHashMap<String, String>();
		convoSeq.put("create a vm",
				"What kind of operating system you would like? Digital Ocean supports Ubuntu, FreeBSD, Fedora, Debian, CoreOS, CentOS");
		convoSeq.put("Windows", "Please specify the configuration you want? (example: 512mb, 1gb)");
		convoSeq.put("512mb",
				"Type **plain** to get a plain Vm OR Type **flavored** to add jenkins flavor on top of your VM");
		convoSeq.put("plain",
				"Unfortunaly, Digital Ocean do not support entered Operating System. Please select from the given list only!!!");
		conversation(convoSeq);

	}

	// USE CASE - 2 Create a VM with Eclipse Installed
	@Test
	public void testD() throws Exception {
		// Happy Path
		LinkedHashMap<String, String> convoSeq = new LinkedHashMap<String, String>();
		convoSeq.put("create a vm with eclipse image",
				"What kind of operating system you would like? Digital Ocean supports Ubuntu, FreeBSD, Fedora, Debian, CoreOS, CentOS");
		convoSeq.put("Ubuntu", "Please specify the configuration you want? (example: 512mb, 1gb)");
		convoSeq.put("512mb",
				"Please provide list of plugins (separated by \" , \") you want to install with eclipse. Currently, I support firebugs, checklist, Hibernate, Subversive.");
		convoSeq.put("firebugs", "Your VM image has been created and posted on your digital Ocean Account");
		conversation(convoSeq);
		// Sad Path
		convoSeq = new LinkedHashMap<String, String>();
		convoSeq.put("create a vm with eclipse image",
				"What kind of operating system you would like? Digital Ocean supports Ubuntu, FreeBSD, Fedora, Debian, CoreOS, CentOS");
		convoSeq.put("Windows", "Please specify the configuration you want? (example: 512mb, 1gb)");
		convoSeq.put("512mb",
				"Please provide list of plugins (separated by \" , \") you want to install with eclipse. Currently, I support firebugs, checklist, Hibernate, Subversive.");
		convoSeq.put("firebugs",
				"Unfortunaly, Digital Ocean do not support entered Operating System. Please select from the given list only!!!");
		conversation(convoSeq);
	}

	// USE CASE 3 - Part A Test Show Reservations
	@Test
	public void testE() throws Exception {
		WebDriverWait wait = new WebDriverWait(driver, 50);
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);

		Actions sendTextActions = new Actions(driver);
		sendTextActions.moveToElement(messageBot);
		sendTextActions.click();
		sendTextActions.sendKeys("Manage Reservation");
		sendTextActions.sendKeys(Keys.RETURN);
		sendTextActions.build().perform();

		wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(
				"(//div[@class='day_msgs']//span[@class='message_body'])[last()][.='Here are all your reservations:']")));
		WebElement message = driver
				.findElement(By.xpath("(//div[@class='day_msgs']//span[@class='message_body'])[last()]"));

		assertEquals(message.getText(), "Here are all your reservations:");

		// Wait until AutoBot outputs complete list of Reservations made by the user
		Thread.sleep(2000);
	}

	// USE CASE 3 - Part B Test Update Reservations
	@Test
	public void testF() throws Exception {
		// Happy Path
		LinkedHashMap<String, String> convoSeq = new LinkedHashMap<String, String>();
		convoSeq.put("update droplet", "Please enter droplet Id to update");
		convoSeq.put("3164494", "Please enter new desired configuration (example: 512mb, 1gb)");
		convoSeq.put("1gb", "Droplet has been updated Succesfully");
		conversation(convoSeq);
		// Sad Path
		convoSeq = new LinkedHashMap<String, String>();
		convoSeq.put("update droplet", "Please enter droplet Id to update");
		convoSeq.put("12345678", "Please enter new desired configuration (example: 512mb, 1gb)");
		convoSeq.put("1gb",
				"No Reservation found with given ID. Please input correct reservation ID and try again!!!");
		conversation(convoSeq);

	}

	// USE CASE 3 - Part C Test Delete VM
	@Test
	public void testG() throws Exception {
		// Happy Path
		LinkedHashMap<String, String> convoSeq = new LinkedHashMap<String, String>();
		convoSeq.put("delete droplet", "Please specify Reservation Id?");
		convoSeq.put("3164494", "I have sent you an OTP. Please enter OTP to verify the terminate action!!");
		convoSeq.put("autobots", "Reservation Deleted Successfully");
		conversation(convoSeq);

		// Sad Path
		convoSeq = new LinkedHashMap<String, String>();
		convoSeq.put("delete droplet", "Please specify Reservation Id?");
		convoSeq.put("3164494", "I have sent you an OTP. Please enter OTP to verify the terminate action!!");
		convoSeq.put("decepticons", "OTP Verification failed. Please try again!!!");
		conversation(convoSeq);
	}

	// Method to perform the conversation
	public static void conversation(LinkedHashMap<String, String> convoSeq) throws Exception {

		WebDriverWait wait = new WebDriverWait(driver, 500);
		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		Set<String> keys = convoSeq.keySet();

		Actions sendTextActions = new Actions(driver);
		sendTextActions.moveToElement(messageBot);
		sendTextActions.click();

		for (String textToSend : keys) {
			sendTextActions.sendKeys(textToSend);
			sendTextActions.sendKeys(Keys.RETURN);
			sendTextActions.build().perform();

			// Wait until the desired output is received
			wait.until(ExpectedConditions.visibilityOfElementLocated(
					By.xpath("(//div[@class='day_msgs']//span[@class='message_body'])[last()][.='"
							+ convoSeq.get(textToSend) + "']")));

			WebElement message = driver
					.findElement(By.xpath("(//div[@class='day_msgs']//span[@class='message_body'])[last()]"));
			assertEquals(message.getText(), convoSeq.get(textToSend));
		}
	}
}