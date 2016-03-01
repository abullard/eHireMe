//
//  EHMSettingsViewController.m
//  eHireMe-iOS
//
//  Created by Mac Liu on 2/29/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import "EHMSettingsViewController.h"

#import <AFNetworking.h>
#import "EHMProfilePicTableViewCell.h"
#import "EHMInfoTableViewCell.h"
#import "EHMConstants.h"
#import "EHMApplicant.h"

@interface EHMSettingsViewController () <UITableViewDelegate, UITableViewDataSource>

@property (strong, nonatomic) EHMApplicant *applicant;

@end

@implementation EHMSettingsViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    self.tableView.delegate = self;
    self.tableView.dataSource = self;
    
    //Setup NavigationBar colors
    self.navigationController.navigationBar.barTintColor = [UIColor redColor];
    self.navigationController.navigationBar.tintColor = [UIColor whiteColor];
    self.navigationController.navigationBar.titleTextAttributes = [NSDictionary dictionaryWithObject:[UIColor whiteColor] forKey:NSForegroundColorAttributeName];
    
    [self getUserInfo];
}

#pragma mark - IBActions

- (IBAction)close:(UIBarButtonItem *)sender {
    [self.presentingViewController dismissViewControllerAnimated:YES completion:nil];
}

#pragma mark TableView Delegates and Datasource

-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 3;
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    if (section == 0) {
        return 1;
    } else if (section == 1) {
        return 7;
    } else {
        return 2;
    }
}

-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    if (indexPath.section == 0) {
        return 150;
    }
    return 44;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell;
    if (indexPath.section == 0 && indexPath.row == 0) {
        cell = (EHMProfilePicTableViewCell *) [tableView dequeueReusableCellWithIdentifier:@"ProfilePicCell" forIndexPath:indexPath];
        ((EHMProfilePicTableViewCell *) cell).profileImageView.image = [UIImage imageNamed:@"profile-placeholder"];
        cell.backgroundColor = [UIColor redColor];
    } else if (indexPath.section == 1) {
        NSString *infoText = nil;
        NSString *placeholder = nil;
        switch (indexPath.row) {
            case 0:
                infoText = self.applicant.name;
                placeholder = @"Name";
                break;
            case 1:
                infoText = self.applicant.email;
                placeholder = @"Email";
                break;
            case 2:
                infoText = [NSString stringWithFormat:@"%li", self.applicant.age];
                placeholder = @"Age";
                break;
            case 3:
                infoText = self.applicant.dob;
                placeholder = @"Date of birth";
                break;
            case 4:
                infoText = self.applicant.bio;
                placeholder = @"Bio";
                break;
            case 5:
                infoText = self.applicant.city;
                placeholder = @"City";
                break;
            case 6:
                infoText = self.applicant.state;
                placeholder = @"State";
                break;
            default:
                break;
        }
        cell = (EHMInfoTableViewCell *) [tableView dequeueReusableCellWithIdentifier:@"InfoCell" forIndexPath:indexPath];
        ((EHMInfoTableViewCell *) cell).textField.text = infoText;
        ((EHMInfoTableViewCell *) cell).textField.placeholder = placeholder;

    } else {
        if (indexPath.row == 0) {
            cell = [tableView dequeueReusableCellWithIdentifier:@"SaveCell" forIndexPath:indexPath];
        } else {
            cell = [tableView dequeueReusableCellWithIdentifier:@"LogoutCell" forIndexPath:indexPath];
        }
    }
    
    return cell;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    if (indexPath.section == 0 && indexPath.row == 0) {
        // Update Profile Picture
    } else if (indexPath.section == 2 && indexPath.row == 0) {
        // Save and update User Info
    } else if (indexPath.section == 2 && indexPath.row == 1) {
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        [defaults setObject:@"" forKey:@"EHMUser_ID"];
        [defaults setObject:@"" forKey:@"EHMUser_Email"];
        [defaults synchronize];
        [self performSegueWithIdentifier:@"Logout" sender:nil];
    }
}

#pragma mark - Helper Methods

- (void) getUserInfo {
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *userId = [defaults objectForKey:@"EHMUser_ID"];
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    [manager GET:[NSString stringWithFormat:@"%@/applicants/%@", baseURL, userId] parameters:nil progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        NSLog(@"%@", responseObject);
        self.applicant = [[EHMApplicant alloc] initWithDictionary:responseObject];
        [self.tableView reloadData];
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        NSLog(@"Error: %@", error);
    }];
}

@end
