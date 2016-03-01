//
//  EHMSettingsViewController.m
//  eHireMe-iOS
//
//  Created by Mac Liu on 2/29/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import "EHMSettingsViewController.h"
#import "EHMProfilePicTableViewCell.h"

@interface EHMSettingsViewController () <UITableViewDelegate, UITableViewDataSource>

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
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - IBActions

- (IBAction)close:(UIBarButtonItem *)sender {
    [self.presentingViewController dismissViewControllerAnimated:YES completion:nil];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

#pragma mark TableView Delegates and Datasource

-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return 1;
}

-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    if (indexPath.row == 0) {
        return 150;
    }
    return 44;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell;
    if (indexPath.row == 0) {
        cell = (EHMProfilePicTableViewCell *) [tableView dequeueReusableCellWithIdentifier:@"ProfilePicCell" forIndexPath:indexPath];
        ((EHMProfilePicTableViewCell *) cell).profileImageView.image = [UIImage imageNamed:@"profile-placeholder"];
        cell.backgroundColor = [UIColor redColor];
    }
    return cell;
}

@end
