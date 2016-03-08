//
//  EHMMatchesViewController.m
//  eHireMe-iOS
//
//  Created by Mac Liu on 3/8/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import "EHMMatchesViewController.h"

#import "EHMMatchTableViewCell.h"

@interface EHMMatchesViewController () <UITableViewDataSource, UITableViewDelegate>

@end

@implementation EHMMatchesViewController

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

#pragma mark - IBActions

- (IBAction)backButtonPressed:(UIBarButtonItem *)sender {
    [self.presentingViewController dismissViewControllerAnimated:YES completion:nil];
}

#pragma mark - TableView 

#pragma mark TableView Delegates and Datasource

-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return 4;
}

-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return 80;
}

-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    EHMMatchTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"MatchCell" forIndexPath:indexPath];
    if (indexPath.row == 0) {
        cell.employerLabel.text = @"Texas Roadhouse";
        cell.jobTitleLabel.text = @"Waiter";
    } else if (indexPath.row == 1) {
        cell.employerLabel.text = @"Red Lobster";
        cell.jobTitleLabel.text = @"Waiter";
    } else if (indexPath.row == 2) {
        cell.employerLabel.text = @"Texas Roadhouse";
        cell.jobTitleLabel.text = @"Busser";
    } else {
        cell.employerLabel.text = @"Old Chicago";
        cell.jobTitleLabel.text = @"Waiter";
    }
    cell.imageView.image = [UIImage imageNamed:@"profile-placeholder"];
    return cell;
}


@end
